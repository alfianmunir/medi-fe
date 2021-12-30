// import store from '@/state/store'
import Layout from './layout'
import LayoutAuth from './layout-auth'

export default [
    {
        path: '/',
        name: 'default',
        component: () => import('./landing/index'),
    },
    {
        path: '/login',
        name: 'default',
        component: LayoutAuth,
        children: [
            {
                path: '',
                component: require('@/router/login/pasien/index').default, 
            },
        ] 
    },
    {
        path: '/login/staff',
        name: 'default',
        component: () => import('./login/staff/index'),
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'perawat',
                name:'Dashboard Perawat',
                component: require('@/router/dashboard/perawat').default, 
            },
            {
                path: 'dokter',
                name:'Dashboard Dokter',
                component: require('@/router/dashboard/dokter').default, 
            },
            {
                path: 'manajemen-pasien',
                name:'Manajemen Pasien',
                component: require('@/router/manajemen_pasien/index').default, 
            },
            {
                path: 'manajemen-obat',
                name:'Manajemen Obat',
                component: require('@/router/manajemen_obat/index').default, 
            },
            {
                path: 'statistik',
                name:'Statistik',
                component: require('@/router/statistik/index').default, 
            },
            {
                path: 'pengaturan',
                name:'Pengaturan',
                component: require('@/router/pengaturan/index').default, 
            },
        ]
    },     
]