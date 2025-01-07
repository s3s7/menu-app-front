import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useMenuApi } from '@/hooks/useMenuApi'
import { NOT_LOGIN_ERROR_MSG } from '@/utils/constants'

type CopyMenuFormProps = {
  onClose: () => void
}

export const CopyMenuForm: FC<CopyMenuFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedMenu, menuApiLoading } =
    useAuthContext()
  const { copyMenu } = useMenuApi()
  const { showToast } = useToast()

  const CopyMenuFunc = async () => {
    if (currentUser && dbUserData && selectedMenu) {
      const idToken = await currentUser.getIdToken()
      const success = await copyMenu(idToken, currentUser.uid, selectedMenu)

      if (success) {
        onClose()
      }
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    CopyMenuFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedMenu)

  return (
    <>
      {selectedMenu && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            {`「${selectedMenu.title}」をコピーします。コピーした旅行プランは非公開で保存されます。`}
          </p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="コピー"
              isFormValid={isFormValid}
              loading={menuApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
