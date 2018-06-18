import { FabrixModel, FabrixService, FabrixResolver, FabrixPolicy, FabrixController, FabrixGeneric } from '../'

export interface IApi {
  [key: string]: {[key: string]: any},
  // models?: {[key: string]: FabrixModel},
  // services?: {[key: string]: FabrixService},
  // resolvers?: {[key: string]: FabrixResolver},
  // policies?: {[key: string]: FabrixPolicy},
  // controllers?: {[key: string]: FabrixController}
}
