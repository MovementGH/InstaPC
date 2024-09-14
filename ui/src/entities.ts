// Interfaces of database entities

export enum OS {
    Win11 = "windows-11",
    Win10 = "windows-10",
    Win8 = "windows-8",
    Win7 = "windows-7",
    WinVista = "windows-vista",
    WinXP = "windows-xp",
    Arch = "arch-basic",
    ArchKDE = "arch-kde",
    Kali = "kali",
    Ubuntu2004 = "ubuntu-20.04",
    Ubuntu2404 = "ubuntu-24.04",
    MacSonomoa = "macos-sonoma",
    MacVentura = "macos-ventura",
    MacMonterey = "macos-monterey",
    MacBigSur = "macos-big-sur",
}

export const OS_UI_NAMES = {
    [OS.Win11]: "Windows 11",
    [OS.Win10]: "Windows 10",
    [OS.Win8]: "Windows 10",
    [OS.Win7]: "Windows 7",
    [OS.WinVista]: "Windows Vista",
    [OS.WinXP]: "Windows XP",
    [OS.Arch]: "Arch (Barebones)",
    [OS.ArchKDE]: "Arch (KDE)",
    [OS.Kali]: "Kali",
    [OS.Ubuntu2004]: "Ubuntu 20.04",
    [OS.Ubuntu2404]: "Ubuntu 24.04",
    [OS.MacSonomoa]: "Mac OS (Sonomoa)",
    [OS.MacVentura]: "Mac OS (Ventura)",
    [OS.MacMonterey]: "Mac OS (Monterey)",
    [OS.MacBigSur]: "Mac OS (Big Sur)"
}

export interface VMData {
    name: string;
    os: OS;
    memory: number;
    cores: number;
    disk: number;
    id: string;
    owner: string;
}