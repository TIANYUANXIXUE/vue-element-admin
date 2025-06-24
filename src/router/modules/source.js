import Layout from '@/layout'

const sourceRouter = {
  path: '/source',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/source/index'),
      name: 'SourceList',
      meta: { title: '信源管理', icon: 'el-icon-s-operation' }
    }
  ]
}

export default sourceRouter
