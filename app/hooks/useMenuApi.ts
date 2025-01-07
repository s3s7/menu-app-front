import { useRouter } from 'next/router'
import {
  getMenusAPI,
  getMenuAPI,
  createMenuAPI,
  updateMenuAPI,
  deleteMenuAPI,
  CreateMenuOptions,
  UpdateMenuOptions,
  DbMenuData,
} from '../api/menuApi'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
// import { useSpotApi } from '../hooks/useSpotApi'
import {
  CREATE_TRIP_SUCCESS_MSG,
  COPY_TRIP_SUCCESS_MSG,
  UPDATE_TRIP_SUCCESS_MSG,
  DELETE_TRIP_SUCCESS_MSG,
  GET_TRIP_ERROR_MSG,
  CREATE_TRIP_ERROR_MSG,
  COPY_TRIP_ERROR_MSG,
  UPDATE_TRIP_ERROR_MSG,
  DELETE_TRIP_ERROR_MSG,
  COPY_SUFFIX,
  COPY_TRIP_TITLE_ERROR_MSG,
  MAX_TRIP_TITLE_LENGTH,
  HTTP_STATUS_NO_CONTENT,
  DELETE_TRIP_DATE_ERROR_MSG,
  DELETE_TRIP_DATE_SUCCESS_MSG,
} from '../utils/constants'
import { getNextDay, getPreviousDay } from '../utils/getDate'

export const useMenuApi = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const {
    dbMenusData,
    selectedMenu,
    dbSpotsData,
    setMenuApiLoading,
    setDbMenusData,
    setSelectedMenu,
  } = useAuthContext()
  // const { updateSpot, deleteSpot } = useSpotApi()

  const getMenus = async (idToken: string, user_uid: string) => {
    setMenuApiLoading(true)
    try {
      const data: DbMenuData[] = await getMenusAPI(idToken, user_uid)
      return data
    } catch (e) {
      showToast('error', GET_TRIP_ERROR_MSG)
    } finally {
      setMenuApiLoading(false)
    }
  }

  const getMenu = async (menu_token: string, user_uid?: string) => {
    setMenuApiLoading(true)
    try {
      const data: DbMenuData = await getMenuAPI(menu_token, user_uid)
      return data
    } catch (e) {
      // 利用側のコードで、404ページを返すため何もしない
    } finally {
      setMenuApiLoading(false)
    }
  }

  const createMenu = async (
    idToken: string,
    user_uid: string,
    options: CreateMenuOptions
  ) => {
    setMenuApiLoading(true)
    try {
      const data: DbMenuData = await createMenuAPI(idToken, user_uid, options)
      setDbMenusData([...(dbMenusData || []), data])
      await router.push('/')
      showToast('success', CREATE_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', CREATE_TRIP_ERROR_MSG)
    } finally {
      setMenuApiLoading(false)
    }
  }

  const copyMenu = async (
    idToken: string,
    user_uid: string,
    menu: DbMenuData
  ) => {
    setMenuApiLoading(true)

    try {
      const copiedTitle = menu.title + COPY_SUFFIX

      if (copiedTitle.length > MAX_TRIP_TITLE_LENGTH) {
        showToast('error', COPY_TRIP_TITLE_ERROR_MSG)
        return
      }

      const data: DbMenuData = await createMenuAPI(
        idToken,
        user_uid,
        undefined,
        menu.menu_token
      )
      setDbMenusData([...(dbMenusData || []), data])
      showToast('success', COPY_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', COPY_TRIP_ERROR_MSG)
    } finally {
      setMenuApiLoading(false)
    }
  }

  const updateMenu = async (
    idToken: string,
    user_uid: string,
    menu_token: string,
    options: UpdateMenuOptions,
    success_msg?: string,
    error_msg?: string
  ) => {
    setMenuApiLoading(true)
    try {
      const data: DbMenuData = await updateMenuAPI(
        idToken,
        user_uid,
        menu_token,
        options
      )
      if (dbMenusData) {
        const updatedMenusData = dbMenusData.map((menuData: DbMenuData) =>
          menuData.menu_token === menu_token ? data : menuData
        )
        setDbMenusData(updatedMenusData)
      }

      if (selectedMenu) {
        setSelectedMenu(data)
      }

      showToast(
        'success',
        `${success_msg ? success_msg : UPDATE_TRIP_SUCCESS_MSG}`
      )
      return data
    } catch (e) {
      showToast('error', `${error_msg ? error_msg : UPDATE_TRIP_ERROR_MSG}`)
    } finally {
      setMenuApiLoading(false)
    }
  }

  const deleteMenu = async (
    idToken: string,
    user_uid: string,
    menu_token: string
  ) => {
    setMenuApiLoading(true)
    try {
      const statusCode: number = await deleteMenuAPI(
        idToken,
        user_uid,
        menu_token
      )
      if (statusCode === HTTP_STATUS_NO_CONTENT) {
        if (dbMenusData) {
          const updatedMenusData = dbMenusData.filter(
            (menuData: DbMenuData) => menuData.menu_token !== menu_token
          )
          setDbMenusData(updatedMenusData)
        }
        await router.push('/')
        showToast('success', DELETE_TRIP_SUCCESS_MSG)
        return true
      } else {
        showToast('error', DELETE_TRIP_ERROR_MSG)
        return false
      }
    } catch (e) {
      showToast('error', DELETE_TRIP_ERROR_MSG)
    } finally {
      setMenuApiLoading(false)
    }
  }

  const deleteMenuDate = async (
    idToken: string,
    user_uid: string,
    menu_token: string,
    date: string
  ) => {
    setMenuApiLoading(true)
    if (!selectedMenu) {
      throw new Error('selectedMenu must be provided.')
    }

    try {
      let newStartDate = selectedMenu.start_date
      let newEndDate = selectedMenu.end_date
      const isInBetweenDay = date !== newStartDate && date !== newEndDate

      if (date === newStartDate) {
        newStartDate = getNextDay(newStartDate)
      } else {
        newEndDate = getPreviousDay(newEndDate)
      }

      const data: DbMenuData = await updateMenuAPI(
        idToken,
        user_uid,
        menu_token,
        {
          start_date: newStartDate,
          end_date: newEndDate,
        }
      )
      if (dbMenusData) {
        const updatedMenusData = dbMenusData.map((menuData: DbMenuData) =>
          menuData.menu_token === menu_token ? data : menuData
        )
        setDbMenusData(updatedMenusData)
      }
      if (selectedMenu) {
        setSelectedMenu(data)
      }

      if (Boolean(dbSpotsData?.length)) {
        await deleteSpot(idToken, user_uid, menu_token, undefined, date, true)

        if (isInBetweenDay) {
          // 削除した旅行日の日付分、スポットの日付を1日前倒しする
          await updateSpot(
            idToken,
            user_uid,
            menu_token,
            undefined,
            undefined,
            date,
            '-1',
            true
          )
        }
      }

      showToast('success', DELETE_TRIP_DATE_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', DELETE_TRIP_DATE_ERROR_MSG)
    } finally {
      setMenuApiLoading(false)
    }
  }

  return {
    getMenus,
    getMenu,
    createMenu,
    copyMenu,
    updateMenu,
    deleteMenu,
    deleteMenuDate,
  }
}
