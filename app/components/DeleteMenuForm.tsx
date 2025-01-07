import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useMenuApi } from '@/hooks/useMenuApi'
import { NOT_LOGIN_ERROR_MSG } from '@/utils/constants'

type DeleteMenuFormProps = {
  onClose: () => void
}

export const DeleteMenuForm: FC<DeleteMenuFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedMenu, menuApiLoading } =
    useAuthContext()
  const { deleteMenu } = useMenuApi()
  const { showToast } = useToast()

  const DeleteMenuFunc = async () => {
    if (currentUser && dbUserData && selectedMenu) {
      const idToken = await currentUser.getIdToken()
      const success = await deleteMenu(
        idToken,
        currentUser.uid,
        selectedMenu.menu_token
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
    DeleteMenuFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedMenu)

  return (
    <>
      {selectedMenu && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            {`「${selectedMenu.title}」を削除します。削除した旅行プランはアクセスできなくなります。`}
          </p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="削除"
              isFormValid={isFormValid}
              loading={menuApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
