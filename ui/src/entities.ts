// Interfaces of database entities

export enum OS {
    Win11 = "windows-11",
    WinXP = "windows-xp",
    Arch = "arch-basic",
    ArchKDE = "arch-kde",
    Centos = "centos",
    MacVentura = "macos-ventura",
}

export const OS_UI_NAMES = {
    [OS.Win11]: "Windows 11",
    [OS.WinXP]: "Windows XP",
    [OS.Arch]: "Arch (Barebones)",
    [OS.ArchKDE]: "Arch (KDE)",
    [OS.Centos]: "Centos",
    [OS.MacVentura]: "Mac OS (Ventura)"
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