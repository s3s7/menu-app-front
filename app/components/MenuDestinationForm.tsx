import React, { FC, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { SelectField } from '@/components/SelectField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useForm } from '@/hooks/useForm'
import { useMenuApi } from '@/hooks/useMenuApi'
import {
  NOT_LOGIN_ERROR_MSG,
  MENU_DESTINATION_ITEMS,
  UPDATE_MENU_DESTINATION_ERROR_MSG,
  UPDATE_MENU_DESTINATION_SUCCESS_MSG,
} from '@/utils/constants'

type MenuDestinationFormProps = {
  onClose: () => void
}

export const MenuDestinationForm: FC<MenuDestinationFormProps> = ({
  onClose,
}) => {
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
          prefecture_id: parseInt(menuDestination),
        },
        UPDATE_MENU_DESTINATION_SUCCESS_MSG,
        UPDATE_MENU_DESTINATION_ERROR_MSG
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
    menuDestination,
    isMenuDestinationFormValid,
    handleMenuDestinationChange,
  } = useForm()

  useEffect(() => {
    if (selectedMenu) {
      handleMenuDestinationChange({
        target: { value: String(selectedMenu.prefecture_id) },
      } as React.ChangeEvent<HTMLSelectElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu])

  return (
    <>
      {selectedMenu && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            旅行先を変更します。
          </p>
          <SelectField
            id="menu-destination"
            labelName="旅行先"
            srOnly={true}
            value={menuDestination}
            items={MENU_DESTINATION_ITEMS}
            disabledItemValue={String(selectedMenu.prefecture_id)}
            onChange={handleMenuDestinationChange}
          />
          <form onSubmit={handleSubmit}>
            <FormButton
              label="変更"
              isFormValid={isMenuDestinationFormValid}
              loading={menuApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
