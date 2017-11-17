import storage from '../../libs/storageSwitcher'
import getTeams from '../../libs/getTeams'

const DELAY_WORDING = chrome.i18n.getMessage('pageScrollDelayWords').split(',')

let selector = document.getElementById('defaultActionSelector')
let fileSizeLimit = document.getElementById('fileSizeLimitRange')
let fileSizeLimitCurrentSetting = document.getElementById('fileSizeLimitCurrentSetting')
let delaySelector = document.getElementById('pageScrollDelayRange')
let delayCurrentSetting = document.getElementById('delayCurrentSetting')
let contextMenuSetting = document.getElementById('contextMenuSetting')
let pasteSupportSetting = document.getElementById('pasteSupportSetting')

storage.get()
  .then((item) => {
    selector.value = item.behavior
    delaySelector.value = item.delay
    delayCurrentSetting.textContent = DELAY_WORDING[item.delay]
    pasteSupportSetting.checked = item.pasteSupport
    contextMenuSetting.checked = item.contextMenu
    fileSizeLimit.value = item.fileSizeLimit
    fileSizeLimitCurrentSetting.textContent = item.fileSizeLimit + ' MB'
  })
;[
  'defaultActionLabel', 'selectElement', 'selectArea',
  'contextMenuSettingLabel', 'pasteSupportSettingLabel',
  'fileSizeLimitLabel', 'fileSizeLimitHelpText', 'pageScrollDelayLabel',
  'pageScrollDelayHelpText', 'currentTeamLabel', 'loginToTeamsLink'
].forEach((id) => {
  document.getElementById(id).textContent = chrome.i18n.getMessage(id)
})

if (process.env.BUILD_EXTENSION_TYPE === 'teams') {
  getTeams()
    .then(async (teams) => {
      const {team} = await storage.get()
      document.getElementById('currentTeamName').textContent = team.name
    })
} else {
  document.getElementById('currentTeam').style.display = 'none'
}

contextMenuSetting.addEventListener('change', (event) => {
  storage.set({contextMenu: event.target.checked})
})

selector.addEventListener('change', function (event) {
  storage.set({behavior: event.target.value})
})

fileSizeLimit.addEventListener('change', function (event) {
  storage.set({fileSizeLimit: event.target.value})
    .then(() => {
      fileSizeLimitCurrentSetting.textContent = event.target.value + ' MB'
    })
})

delaySelector.addEventListener('change', function (event) {
  storage.set({delay: event.target.value})
    .then(() => {
      delayCurrentSetting.textContent = DELAY_WORDING[event.target.value]
    })
})

pasteSupportSetting.addEventListener('change', (event) => {
  storage.set({pasteSupport: pasteSupportSetting.checked})
})
