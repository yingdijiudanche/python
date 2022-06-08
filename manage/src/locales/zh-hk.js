/**繁体 @see https://www.aies.cn/ */

export default {
  notFound: '無法找到頁面',
  routes: {
    common: {
      edit: '編輯{name}',
      add: '新增{name}',
    },
    '/dashboard': '儀表板',
    '/backstage': '後台管理',
    '/admin/index': '管理員列表',
    '/route/index': '路由管理',
    '/role/index': '角色管理',
    '/admin': '管理員',
    '/route': '路由',
    '/role': '角色',
  },
  userActions: {
    profile: '個人資料',
    editPwd: '修改密碼',
    logout: '登出',
    confirm: {
      title: '操作提醒',
      ok: '確定',
      cancel: '取消',
      content: '確定要登出嗎?',
    },
  },
  buttons: {
    add: '新增',
    edit: '編輯',
    dele: '刪除',
    search: '搜尋',
    reset: '重設',
    submit: '提交',
  },
  tips: {
    autoGen: '預設自動生成',
  },
  deleConfirm: {
    title: '確定要刪除嗎',
    yes: '確定',
    cancel: '取消',
  },
  table: {
    addTime: '添加時間',
    operation: '操作',
  },
  formTip: {
    input: '請輸入{name}!',
    select: '請選擇{name}!',
    confirmFail: '兩次{name}輸入不一致!',
    account: '只接受數字或字母!',
  },
  placeholder: {
    selector: '點擊選取',
    routeParent: '不選並且<元件>留空，表示新增一個父項功能表',
    search: '搜尋{title}',
  },
  admin: {
    login: '登入',
    account: '帳戶',
    name: '用戶名',
    email: '電郵',
    role: '角色',
    password: '密碼',
    oldPwd: '當前密碼', //修改密码时
    newPwd: '新密碼', //修改密码时
    confirm: '確認密碼',
    remember_me: '記住我',
    title: '職位',
    staffNo: '工號',
    disabled: '已停用',
    qualifyNum: '資格證書',
  },
  route: {
    pid: '父項',
    name: '名稱',
    path: '路徑',
    component: '元件',
    sort: '排序',
    isMenu: '是否功能表',
    icon: '圖示',
  },
  role: {
    name: '角色名稱',
    ownRoutes: '擁有權限',
    all: '全部',
    assign: '分配權限',
  },
}
