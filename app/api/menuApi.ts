import axios from 'axios'
import { USERS_URL, MENUS_URL } from '@/utils/constants'

export type DbMenuData = {
  id: number
  user_id: number
  prefecture_id: number
  title: string
  start_date: string
  end_date: string
  memo: string
  image_path: string
  is_public: boolean
  menu_token: string
  created_at: string
  updated_at: string
}

export type CreateMenuOptions = {
  user_id: number
  prefecture_id: number
  title: string
  start_date: string
  end_date: string
}

export type UpdateMenuOptions = {
  prefecture_id?: number
  title?: string
  start_date?: string
  end_date?: string
  memo?: string
  image_path?: string
  is_public?: boolean
}

// ユーザーの全ての旅行プランの取得
export const getMenusAPI = async (idToken: string, user_uid: string) => {
  try {
    const res = await axios.get(`${USERS_URL}/${user_uid}${MENUS_URL}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 特定の旅行プランの取得
export const getMenuAPI = async (menu_token: string, user_uid?: string) => {
  try {
    const url = user_uid
      ? `${USERS_URL}/${user_uid}${MENUS_URL}/${menu_token}`
      : `${MENU_URL}/${menu_token}`

    const res = await axios.get(url)
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの作成・コピー
export const createMenuAPI = async (
  idToken: string,
  user_uid: string,
  options?: CreateMenuOptions,
  copy_menu_token?: string
) => {
  try {
    const url = options
      ? `${USERS_URL}/${user_uid}${MENU_URL}`
      : `${USERS_URL}/${user_uid}${MENU_URL}?copy_menu_token=${copy_menu_token}`

    const params = options ? { menu: options } : null

    const res = await axios.post(url, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの更新
export const updateMenuAPI = async (
  idToken: string,
  user_uid: string,
  menu_token: string,
  options: UpdateMenuOptions
) => {
  try {
    const params: { menu: UpdateMenuOptions } = {
      menu: options,
    }

    const res = await axios.patch(
      `${USERS_URL}/${user_uid}${MENU_URL}/${menu_token}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの削除
export const deleteMenuAPI = async (
  idToken: string,
  user_uid: string,
  menu_token: string
) => {
  try {
    const res = await axios.delete(
      `${USERS_URL}/${user_uid}${MENU_URL}/${menu_token}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
    return res.status
  } catch (e) {
    throw e
  }
}
