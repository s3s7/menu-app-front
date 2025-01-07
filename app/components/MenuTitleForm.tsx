import React, { FC, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '../components/FormButton'
import { InputField } from '../components/InputField'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useForm } from '../hooks/useForm'
import { useMenuApi } from '../hooks/useMenuApi'
import {
  UPDATE_MENU_TITLE_SUCCESS_MSG,
  UPDATE_MENU_TITLE_ERROR_MSG,
  MAX_MENU_TITLE_LENGTH,
  NOT_LOGIN_ERROR_MSG,
} from '../constants/constants'

type MenuTitleFormProps = {
  onClose: () => void
}

export const MenuTitleForm: FC<MenuTitleFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedMenu, menuApiLoading } =
    useAuthContext()
  const { updateMenu } = useMenuApi()
  const { showToast } = useToast()

  const updateMenuFunc = async () => {
    if (currentUser && dbUserData && selectedMenu) {
      const idToken = await currentUser.getIdToken()
      const success = await updateMenu(
        idToken,
        currentUser.uid,
        selectedMenu.menu_token,
        {
          title: menuTitle,
        },
        UPDATE_MENU_TITLE_SUCCESS_MSG,
        UPDATE_MENU_TITLE_ERROR_MSG
      )

      if (success) {
        onClose()
      }
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateMenuFunc()
  }

  const {
    menuTitle,
    menuTitleError,
    isMenuTitleFormValid,
    handleMenuTitleChange,
    handleMenuTitleBlur,
  } = useForm()

  useEffect(() => {
    if (selectedMenu) {
      handleMenuTitleChange({
        target: { value: selectedMenu.title },
      } as React.ChangeEvent<HTMLInputElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu])

  return (
    <>
      {selectedMenu && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            旅行タイトルを変更します。
          </p>
          <InputField
            id="menu-title"
            type="text"
            labelName="旅行タイトル"
            srOnly={true}
            maxLength={MAX_MENU_TITLE_LENGTH}
            value={menuTitle}
            onChange={handleMenuTitleChange}
            onBlur={handleMenuTitleBlur}
            error={menuTitleError}
          />
          <form onSubmit={handleSubmit}>
            <FormButton
              label="変更"
              isFormValid={isMenuTitleFormValid}
              loading={menuApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
