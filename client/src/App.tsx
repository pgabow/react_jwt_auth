import React, { FC, useContext, useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { Context } from './index'
import { observer } from 'mobx-react-lite'
import { IUser } from './models/IUser'
import UserService from './services/UserService'

const App: FC = () => {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <p></p>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
    )
  }

  return (
    <div>
      <h3>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь'}</h3>
      <p>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'Подтвердите аккаунт!'}</p>
      <p></p>
      <button onClick={() => store.logout()}>Выйти</button>
      <p></p>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  )
}

export default observer(App)
