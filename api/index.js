const express = require('express');
const bodyParser = require('body-parser');
const child = require('child_process');
const fs = require('fs');
const morgan = require('morgan');
const snowflakeId = require('snowflake-id');
 
// Initialize snowflake
const snowflake = new snowflakeId.default({
    mid : 42,
    offset : (2019-1970)*31536000*1000
});

const app = express();

const PORT = process.env.PORT || 3000;
const DEFAULT_VM = {
    name: 'New VM',
    os: 'windows 11',
    memory: 4096,
    cores: 2,
    disk: 32
};

const vms = JSON.parse(fs.readFileSync('vms.json').toString());

function RunCommand(command) {
    return new Promise( (Resolve, Reject) => {
        child.exec(command, (error, stdout, stderr) => {
            if(error || stderr?.length)
                Reject({ error, stderr });
            else
                Resolve(stdout);
        })
    });
}

async function CreateVMContainer(vm) {
    let creationCommand = '';

    if(vm.os == 'windows 11') {
        creationCommand = `docker create --name vm-${vm.id} --env PUID=1000 --env PGID=1000 --env DISK_SIZE=${vm.disk} --env RAM_SIZE=${vm.memory} --env CPU_CORES=${vm.cores} --env USERNAME=vm --env PASSWORD=vm --device /dev/kvm --cap-add NET_ADMIN --restart unless-stopped --stop-timeout 30 --network instapc-vms dockurr/windows`;
    }

    console.log(`Creating VM "${vm.name}" (${vm.id})`);

    return await RunCommand(creationCommand);
}

function DeleteVMContainer(vm) {
    console.log(`Deleting VM "${vm.name}" (${vm.id})`);

    return RunCommand(`docker container rm vm-${vm.id}`).catch(error => {
        if(error.stderr.match('No such container')) {
            CreateVMContainer(vm).then(() => StartVM(vm));
            return;
        }

        throw error;
    });
}

async function StartVM(vm) {
    console.log(`Starting VM "${vm.name}" (${vm.id})`);

    const result = await RunCommand(`docker start vm-${vm.id}`).catch(error => {
        if(error.stderr.match('No such container')) {
            CreateVMContainer(vm).then(() => StartVM(vm));
            return 0;
        }

        throw error;
    });

    if(result === 0)
        return;
}

function StopVM(vm) {
    console.log(`Stopping VM "${vm.name}" (${vm.id})`);
    
    return  RunCommand(`docker stop vm-${vm.id}`).catch(error => {
        if(error.stderr.match('No such container')) {
            CreateVMContainer(vm).then(() => StartVMContainer(vm));
            return;
        }

        throw error;
    });
}

function Authentication(req, _, next) {
    req.user = '1';
    next();
}

function EnsureVMOwnership(req, res, next) {
    let vm = vms.find(vm => vm.id === req.params.id);

    if(!vm)
        return res.sendStatus(404);

    if(vm.owner !== req.user)
        return res.sendStatus(403);

    req.vm = vm;
    next();
}

async function GetVMs(req, res) {
    res.json(vms.filter(vm => vm.owner === req.user));
}

async function GetVM(req, res) {
    res.json(req.vm);
}

async function GetVMStatus(req, res) {
    RunCommand(`docker inspect vm-${req.vm.id}`).then(result => {
        res.json(JSON.parse(result)[0].State.Running ? 1 : 0);
    }).catch(() => {
        res.sendStatus(500);
    })
}

async function PostVMStart(req, res) {
    StartVM(req.vm).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.sendStatus(500);
    });
}

async function PostVMStop(req, res) {
    StopVM(req.vm).then(() => {
        res.sendStatus(204);
    }).catch(() => {
        res.sendStatus(500);
    });
}

async function PostVM(req, res) {
    // TODO: VM Limits?
    req.body.vm = {
        ...DEFAULT_VM,
        ...req.body.vm
    };
    req.body.vm.id = snowflake.generate();
    req.body.vm.owner = req.user;

    CreateVMContainer(req.body.vm).then(() => {
        StartVM(req.body.vm).then(() => {
            res.json(req.body.vm);
        }).catch(() => {
            req.sendStatus(500);
        });
    }).catch(() => {
        req.sendStatus(500);
    })
}

async function PatchVM(req, res) {
    if(!req.body.vm)
        return res.sendStatus(400);

    for(let property of ['name', 'memory', 'cores', 'disk'])
        if(req.body.vm[property] !== undefined)
            req.vm[property] = req.body.vm[property];

    UpdateVM(req.vm).then(() => {
        req.sendStatus(204);
    }).catch(() => {
        req.sendStatus(500);
    })
}

async function DeleteVM(req, res) {
    vms = vms.filter(vm => vm.id !== req.vm.id);
    DeleteVMContainer(req.vm);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests
app.use(Authentication);
app.use('/vm/:id', EnsureVMOwnership);

app.get('/vms', GetVMs);
app.get('/vm/:id', GetVM);
app.get('/vm/:id/status', GetVMStatus);
app.post('/vm/:id/start', PostVMStart);
app.post('/vm/:id/stop', PostVMStop);
app.post('/vm', PostVM);
app.patch('/vm/:id', PatchVM);
app.delete('/vm/:id', DeleteVM);

// Startup
app.listen(PORT, async() => {
    console.log(`InstaPC API is running on port ${PORT}`);

    console.log('Starting VMs...');

    await Promise.all(vms.map(vm => StartVM(vm)));

    console.log('VMs have been started');
});

// Shutdown
[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, (...data) => {
        console.log(`Shutting down due to ${eventType}`);
        if(eventType === 'uncaughtException')
            for(let elem of data)
                console.error(elem);

        // Savews data
        console.log('Saving VM Data...');
        fs.writeFileSync('vms.json', JSON.stringify(vms, null, 2));

        // Stops all VMs
        console.log('Stopping VMs...');
        Promise.all(vms.map(vm => StopVM(vm))).then(() => process.exit(0)).catch(() => process.exit(1));
    });
})