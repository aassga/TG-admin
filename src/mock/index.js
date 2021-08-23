import Mock from 'mockjs'
import { borrowDataO,
  managementData,
  overDueStatic, levelMan,
  codeMana,
  logList,
  activityBlackList,
  lunboMangerList,
  lunboMangerEdit
} from './data'

Mock.mock(/\/get_mborrow_data_o/, borrowDataO)
Mock.mock(/\/get_management_data/, managementData)
Mock.mock(/\/get_over_due_static/, overDueStatic)
Mock.mock(/\/get_level_man/, levelMan)
Mock.mock(/\/get_code_man/, codeMana)
Mock.mock(/\/get_log_list/, logList)
Mock.mock(/\/get_activity_balck_list/, activityBlackList)

Mock.mock(/\/get_lunbo_manger/, lunboMangerList)
Mock.mock(/\/get_lunbo_edit/, lunboMangerEdit)

export default Mock
