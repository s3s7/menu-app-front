import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '..fortawesome/react-fontawesome'
import {
  faLock,
  faUnlock,
  faLocationDot,
  faEllipsis,
} from '..fortawesome/free-solid-svg-icons'
import type { DbMenuData } from '../api/menuApi'
import { DropdownMenu } from '../components/DropdownMenu'
import { DropdownMenuButton } from '../components/DropdownMenuButton'
import { MenuCardModal } from './MenuCardModal.tsx'
import { useAuthContext } from '../context/AuthContext'
import { useDropdown } from '../hooks/useDropdown'
import {
  FORM_COPY_MENU,
  FORM_DELETE_MENU,
  FORM_MENU_DESTINATION,
  FORM_MENU_PHOTO,
  FORM_MENU_PUBLISH_SETTINGS,
  FORM_MENU_TITLE,
  MENUS_URL,
  MENU_DESTINATION_ITEMS,
} from '../constants/constants'
import { formatDate } from '../utils/getDate'

type MenuCardProps = {
  menu: DbMenuData | null
  isDetailPage?: boolean
  viewMode?: boolean
}

export const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  isDetailPage,
  viewMode,
}) => {
  const { setSelectedMenu } = useAuthContext()
  const { dropdownRef, isDropdownVisible, hideDropdown, toggleDropdown } =
    useDropdown()

  const [menuPhotoOpen, setMenuPhotoOpen] = useState(false)
  const [menuPublishSettingsOpen, setMenuPublishSettingsOpen] = useState(false)
  const [menuTitleOpen, setMenuTitleOpen] = useState(false)
  const [menuDestinationOpen, setMenuDestinationOpen] = useState(false)
  const [copyMenuOpen, setCopyMenuOpen] = useState(false)
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false)

  const onOpenModal = (
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    hideDropdown()
    setSelectedMenu(menu)
    setOpenModal(true)
  }

  const onCloseModal = (
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOpenModal(false)
  }

  if (!menu) return null

  const menuImage = (
    <Image
      src={menu.image_path}
      alt={`${menu.title}の旅行画像`}
      fill
      sizes="(max-width: 0px) 0px, 100vw"
      priority
      className={`object-cover ${isDetailPage ? '' : 'rounded-t-md'}`}
      onContextMenu={(e) => e.preventDefault()}
    />
  )

  const menuDescription = (
    <>
      <div
        className={`flex justify-center items-center mb-2 text-sm ${isDetailPage ? 'sm:text-base' : ''
          }`}
      >
        {!viewMode && (
          <FontAwesomeIcon
            icon={menu.is_public ? faUnlock : faLock}
            className="mr-2"
          />
        )}
        <h3
          className={`font-bold ${isDetailPage
            ? ''
            : 'overflow-hidden whitespace-nowrap text-ellipsis'
            }`}
        >
          {menu.title}
        </h3>
      </div>
      <div
        className={`flex justify-between text-xs ${isDetailPage ? 'sm:text-sm' : ''
          }`}
      >
        <p className="text-gray-500">
          {formatDate(menu.start_date)}-{formatDate(menu.end_date)}
        </p>
        <span>
          <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
          {MENU_DESTINATION_ITEMS[menu.prefecture_id - 1]?.name}
        </span>
      </div>
    </>
  )

  const dropDownMenu = (
    <div className="absolute top-0 right-0" ref={dropdownRef}>
      <div
        className="m-2 w-10 h-10 rounded-full bg-gray-500 bg-opacity-80 hover:bg-opacity-60 transition p-1 flex items-center justify-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <FontAwesomeIcon icon={faEllipsis} className="text-white text-2xl" />
      </div>
      <DropdownMenu isVisible={isDropdownVisible} isTop0={true}>
        <DropdownMenuButton
          onClick={() => onOpenModal(setMenuPhotoOpen)}
          label="写真の変更"
        />
        <DropdownMenuButton
          onClick={() => onOpenModal(setMenuPublishSettingsOpen)}
          label="公開状態の変更"
        />
        <DropdownMenuButton
          onClick={() => onOpenModal(setMenuTitleOpen)}
          label="タイトルの変更"
        />
        {isDetailPage && (
          <DropdownMenuButton
            onClick={() => onOpenModal(setMenuDestinationOpen)}
            label="旅行先の変更"
          />
        )}
        {isDetailPage ?? (
          <DropdownMenuButton
            onClick={() => onOpenModal(setCopyMenuOpen)}
            label="コピー"
          />
        )}
        <DropdownMenuButton
          onClick={() => onOpenModal(setDeleteMenuOpen)}
          label="削除"
          className="text-red-500"
        />
      </DropdownMenu>
      {menuPhotoOpen && (
        <MenuCardModal
          open={menuPhotoOpen}
          onClose={() => onCloseModal(setMenuPhotoOpen)}
          form={FORM_MENU_PHOTO}
        />
      )}
      {menuPublishSettingsOpen && (
        <MenuCardModal
          open={menuPublishSettingsOpen}
          onClose={() => onCloseModal(setMenuPublishSettingsOpen)}
          form={FORM_MENU_PUBLISH_SETTINGS}
        />
      )}
      {menuTitleOpen && (
        <MenuCardModal
          open={menuTitleOpen}
          onClose={() => onCloseModal(setMenuTitleOpen)}
          form={FORM_MENU_TITLE}
        />
      )}
      {menuDestinationOpen && (
        <MenuCardModal
          open={menuDestinationOpen}
          onClose={() => onCloseModal(setMenuDestinationOpen)}
          form={FORM_MENU_DESTINATION}
        />
      )}
      {copyMenuOpen && (
        <MenuCardModal
          open={copyMenuOpen}
          onClose={() => onCloseModal(setCopyMenuOpen)}
          form={FORM_COPY_MENU}
        />
      )}
      {deleteMenuOpen && (
        <MenuCardModal
          open={deleteMenuOpen}
          onClose={() => onCloseModal(setDeleteMenuOpen)}
          form={FORM_DELETE_MENU}
        />
      )}
    </div>
  )

  return (
    <div
      className={`relative bg-white ${isDetailPage
        ? ''
        : 'rounded-lg overflow-hidden shadow-md hover:shadow-xl transition'
        }`}
      key={menu.id}
    >
      {isDetailPage ? (
        <>
          <div className="relative pb-[66.666667%]">
            <div className="absolute inset-0">{menuImage}</div>
          </div>
          <div className="p-3 text-gray-700">{menuDescription}</div>
        </>
      ) : (
        <Link
          href={`${MENUS_URL}/${menu.menu_token}`}
          legacyBehavior
          key={menu.id}
        >
          <a className="focus:border-2 focus:border-brand-color block outline-none rounded-lg bg-white">
            <div className="relative pb-[66.666667%]">
              <div className="absolute inset-0">{menuImage}</div>
            </div>
            <div className="p-3 text-gray-700">{menuDescription}</div>
          </a>
        </Link>
      )}

      {!viewMode && dropDownMenu}
    </div>
  )
}
