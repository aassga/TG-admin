import memberRoutes from './member'
import financeRoutes from './finance'
import agencyRoutes from './agency'
import reportRoutes from './report'
import activityRoutes from './activity'
import systemRoutes from './system'

const allRoutes = {
  member: { ...memberRoutes },
  finance: { ...financeRoutes },
  agency: { ...agencyRoutes },
  report: { ...reportRoutes },
  activity: { ...activityRoutes },
  system: { ...systemRoutes }
}

export default allRoutes
