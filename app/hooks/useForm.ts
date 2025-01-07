import { useState } from 'react'
// import { OptionType } from '../components/SelectWithIconField'
import { useAuthContext } from '../context/AuthContext'
// import { SPOT_CATEGORY_OPTIONS } from '../constants/constants'
import {
  getToday,
  getTomorrow,
  getNextDay,
  getOneHourAhead,
  getNowTime,
  getTimeFromString,
} from '../utils/getDate'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateMenuTitle,
  validateSpotName,
  validateStartDate,
  validateEndDate,
  validateStartTime,
  validateEndTime,
  validateCost,
  validateSpotMemo,
  validateMenuMemo,
} from '../utils/validation'

export const useForm = () => {
  const { selectedMenu, dbUserData, currentUser, selectedSpot } =
    useAuthContext()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [menuTitle, setMenuTitle] = useState('')
  const [menuDestination, setMenuDestination] = useState('')
  const [startDate, setStartDate] = useState(getToday())
  const [endDate, setEndDate] = useState(getTomorrow())
  const [spotName, setSpotName] = useState('')
  // const [spotCategory, setSpotCategory] = useState<string>(
  // SPOT_CATEGORY_OPTIONS[0].value
  // )
  const [startTime, setStartTime] = useState(
    selectedSpot ? getTimeFromString(selectedSpot.start_time) : getNowTime()
  )
  const [endTime, setEndTime] = useState(
    selectedSpot
      ? getTimeFromString(selectedSpot.end_time)
      : getOneHourAhead(getNowTime())
  )
  const [cost, setCost] = useState('0')
  const [menuMemo, setMenuMemo] = useState('')
  const [spotMemo, setSpotMemo] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [menuTitleError, setMenuTitleError] = useState('')
  const [spotNameError, setSpotNameError] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [startTimeError, setStartTimeError] = useState('')
  const [endTimeError, setEndTimeError] = useState('')
  const [costError, setCostError] = useState('')
  const [menuMemoError, setMenuMemoError] = useState('')
  const [spotMemoError, setSpotMemoError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [menuTitleTouched, setMenuTitleTouched] = useState(false)
  const [spotNameTouched, setSpotNameTouched] = useState(false)

  const isSignUpFormValid: boolean =
    Boolean(username) &&
    Boolean(email) &&
    Boolean(password) &&
    Boolean(passwordConfirm) &&
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validatePasswordConfirm(password, passwordConfirm)

  const isLoginFormValid: boolean =
    Boolean(email) &&
    Boolean(password) &&
    !validateEmail(email) &&
    !validatePassword(password)

  const isPasswordResetFormValid: boolean =
    Boolean(email) && !validateEmail(email)

  const isUpdateUserFormValid: boolean =
    Boolean(username) &&
    Boolean(email) &&
    Boolean(dbUserData) &&
    Boolean(currentUser) &&
    !validateUsername(username) &&
    !validateEmail(email) &&
    (username !== dbUserData?.name || email !== currentUser?.email)

  const isCreateMenuFormValid: boolean =
    Boolean(menuTitle) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    menuDestination !== '' &&
    !validateMenuTitle(menuTitle) &&
    !validateStartDate(startDate) &&
    !validateEndDate(startDate, endDate)

  const isMenuTitleFormValid: boolean =
    Boolean(menuTitle) &&
    Boolean(selectedMenu) &&
    !validateMenuTitle(menuTitle) &&
    selectedMenu?.title !== menuTitle

  const isMenuDestinationFormValid: boolean =
    menuDestination !== '' &&
    Boolean(selectedMenu) &&
    String(selectedMenu?.prefecture_id) !== menuDestination

  const isMenuMemoFormValid =
    !validateMenuMemo(menuMemo) && String(selectedMenu?.memo) !== menuMemo

  const isSpotFormValid: boolean =
    Boolean(spotName) &&
    Boolean(spotCategory) &&
    Boolean(startTime) &&
    Boolean(endTime) &&
    Boolean(cost) &&
    !validateSpotName(spotName) &&
    !validateStartTime(startTime) &&
    !validateEndTime(startTime, endTime) &&
    !validateCost(cost) &&
    (String(selectedSpot?.name) !== spotName ||
      String(selectedSpot?.category) !== spotCategory ||
      getTimeFromString(String(selectedSpot?.start_time)) !== startTime ||
      getTimeFromString(String(selectedSpot?.end_time)) !== endTime ||
      String(selectedSpot?.cost) !== cost ||
      String(selectedSpot?.memo) !== spotMemo)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameTouched(true)
    const newUsername = e.target.value
    setUsername(newUsername)
    setUsernameError(validateUsername(newUsername))
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailTouched(true)
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPasswordConfirm(e.target.value)
  const handleMenuTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuTitleTouched(true)
    const newMenuTitle = e.target.value
    setMenuTitle(newMenuTitle)
    setMenuTitleError(validateMenuTitle(newMenuTitle))
  }
  const handleMenuDestinationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => setMenuDestination(e.target.value)
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    const parsedDate = Date.parse(newStartDate)

    setStartDate(newStartDate)
    setStartDateError(validateStartDate(newStartDate))

    if (!isNaN(parsedDate)) {
      const newEndDate = getNextDay(newStartDate)
      setEndDate(newEndDate)
      // 終了日にエラーが出ている状態で、開始日を変更してもエラーが消えない対策
      setEndDateError(validateEndDate(newStartDate, newEndDate))
    }
  }
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    setEndDateError(validateEndDate(startDate, newEndDate))
  }
  const handleSpotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpotNameTouched(true)
    const newSpotName = e.target.value
    setSpotName(newSpotName)
    setSpotNameError(validateSpotName(newSpotName))
  }
  // const handleSpotCategoryChange = (selectedOption: OptionType | null) => {
  //   if (selectedOption) {
  //     setSpotCategory(selectedOption.value)
  //   }
  // }
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value

    setStartTime(newStartTime)
    setStartTimeError(validateStartTime(newStartTime))

    if (newStartTime !== '') {
      const newEndTime = getOneHourAhead(newStartTime)
      setEndTime(newEndTime)
      // 終了日にエラーが出ている状態で、開始日を変更してもエラーが消えない対策
      setEndTimeError(validateEndTime(newStartTime, newEndTime))
    }
  }
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value
    setEndTime(newEndTime)
    setEndTimeError(validateEndTime(startTime, newEndTime))
  }
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCostStr = e.target.value

    // 全角数字を半角数字に変換
    newCostStr = newCostStr.normalize('NFKC')

    const isValidNumber = /^0$|^[1-9]\d*$/.test(newCostStr)

    if (newCostStr === '' || isValidNumber) {
      setCost(newCostStr)
      setCostError(validateCost(newCostStr))
    }
  }
  const handleMenuMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMenuMemo = e.target.value
    setMenuMemo(newMenuMemo)
    setMenuMemoError(validateMenuMemo(newMenuMemo))
  }
  const handleSpotMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSpotMemo = e.target.value
    setSpotMemo(newSpotMemo)
    setSpotMemoError(validateSpotMemo(newSpotMemo))
  }

  const handleUsernameBlur = () => {
    if (usernameTouched) {
      setUsernameError(validateUsername(username))
    }
    setUsernameTouched(true)
  }
  const handleEmailBlur = () => {
    if (emailTouched) {
      setEmailError(validateEmail(email))
    }
    setEmailTouched(true)
  }
  const handlePasswordBlur = () => setPasswordError(validatePassword(password))
  const handlePasswordConfirmBlur = () =>
    setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm))
  const handleMenuTitleBlur = () => {
    if (menuTitleTouched) {
      setMenuTitleError(validateMenuTitle(menuTitle))
    }
    setMenuTitleTouched(true)
  }
  const handleSpotNameBlur = () => {
    if (spotNameTouched) {
      setSpotNameError(validateSpotName(spotName))
    }
    setSpotNameTouched(true)
  }
  const handleStartTimeBlur = () =>
    setStartTimeError(validateStartTime(startTime))
  const handleEndTimeBlur = () =>
    setEndTimeError(validateEndTime(startTime, endTime))
  const handleCostBlur = () => setCostError(validateCost(cost))
  const handleMenuMemoBlur = () => setMenuMemoError(validateMenuMemo(menuMemo))
  const handleSpotMemoBlur = () => setSpotMemoError(validateSpotMemo(spotMemo))

  const handleMenuTitleFocus = () => {
    setMenuTitleTouched(true)
  }
  const handleSpotNameFocus = () => {
    setSpotNameTouched(true)
  }

  return {
    username,
    email,
    password,
    passwordConfirm,
    menuTitle,
    menuDestination,
    startDate,
    endDate,
    spotName,
    spotCategory,
    startTime,
    endTime,
    cost,
    menuMemo,
    spotMemo,
    usernameError,
    emailError,
    passwordError,
    passwordConfirmError,
    menuTitleError,
    spotNameError,
    startDateError,
    endDateError,
    startTimeError,
    endTimeError,
    costError,
    menuMemoError,
    spotMemoError,
    isSignUpFormValid,
    isLoginFormValid,
    isPasswordResetFormValid,
    isUpdateUserFormValid,
    isCreateMenuFormValid,
    isMenuTitleFormValid,
    isMenuDestinationFormValid,
    isMenuMemoFormValid,
    isSpotFormValid,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleMenuTitleChange,
    handleMenuDestinationChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSpotNameChange,
    handleSpotCategoryChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleCostChange,
    handleMenuMemoChange,
    handleSpotMemoChange,
    handleUsernameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handlePasswordConfirmBlur,
    handleMenuTitleBlur,
    handleSpotNameBlur,
    handleStartTimeBlur,
    handleEndTimeBlur,
    handleCostBlur,
    handleMenuMemoBlur,
    handleSpotMemoBlur,
    handleMenuTitleFocus,
    handleSpotNameFocus,
  }
}
