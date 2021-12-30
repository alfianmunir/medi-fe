export const menuItems = [
    {
        id: 'nav-title',
        label: "Menu Navigasi",
        isTitle: true, 
        role: ['perawat','dokter']
    },
    {
        id: 'dashboard',
        label: "Dashboard",
        icon: "bx bx-home-circle",
        link: "/perawat", 
        role: ['perawat']
    },
    {
        id: 'dashboard',
        label: "Dashboard",
        icon: "bx bx-home-circle",
        link: "/dokter", 
        role: ['dokter']
    },
    {
        id: 'manajemen-pasien',
        label: "Manajemen Pasien",
        icon: "bx bx-user",
        link: "/manajemen-pasien", 
        role: ['perawat','dokter']
    },
    {
        id: 'manajemen-obat',
        label: "Manajemen Obat",
        icon: "fa fa-capsules",
        link: "/manajemen-obat", 
        role: ['perawat','dokter']
    },
    {
        id: 'statistik',
        label: "Statistik",
        icon: "bx bx-stats",
        link: "/statistik", 
        role: ['dokter']
    },
    {
        id: 'pengaturan',
        label: "Pengaturan",
        icon: "bx bx-cog",
        link: "/pengaturan", 
        role: ['dokter']
    },
];

