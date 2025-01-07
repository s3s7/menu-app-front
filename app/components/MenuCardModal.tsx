import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from '../components/Modal'
import { CopyMenuForm } from '../components/CopyMenuForm'
import { MenuDestinationForm } from '../components/MenuDestinationForm'
// import { MenuPhotoForm } from '../components/MenuPhotoForm'
import { MenuTitleForm } from '../components/MenuTitleForm'
import { DeleteMenuForm } from '../components/DeleteMenuForm'
// import { MenuPublishSettingsForm } from '../components/MenuPublishSettingsForm'
import {
  FORM_DELETE_MENU,
  FORM_COPY_MENU,
  FORM_MENU_PUBLISH_SETTINGS,
  FORM_MENU_DESTINATION,
  FORM_MENU_TITLE,
  FORM_MENU_PHOTO,
} from '../constants/constants'

type MenuCardModalProps = {
  open: boolean
  onClose: () => void
  form: string
}

export const MenuCardModal: FC<MenuCardModalProps> = ({
  open,
  onClose,
  form,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={form} >
      {form === FORM_MENU_PHOTO && <MenuPhotoForm onClose={onClose} />
      }
      {
        form === FORM_MENU_PUBLISH_SETTINGS && (
          <MenuPublishSettingsForm onClose={onClose} />
        )
      }
      {form === FORM_MENU_TITLE && <MenuTitleForm onClose={onClose} />}
      {
        form === FORM_MENU_DESTINATION && (
          <MenuDestinationForm onClose={onClose} />
        )
      }
      {form === FORM_COPY_MENU && <CopyMenuForm onClose={onClose} />}
      {form === FORM_DELETE_MENU && <DeleteMenuForm onClose={onClose} />}
    </Modal>
  )
}
