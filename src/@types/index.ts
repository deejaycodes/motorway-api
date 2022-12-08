export interface vehicleQueryParams {
  timestamp: string
}

export interface vehiclePathParams {
  id: string
}

export interface genericError {
  status: number
  code: string
  message: string
}

export enum ErrorCodes {
  MISSING_PARAM = 'missing_param',
  NOT_FOUND = 'not_found',
  PARAM_NOT_VALID = 'param_not_valid',
}

export enum VehicleStates {
  QUOTED = 'quoted',
  SELLING = 'selling',
  SOLD = 'sold',
}

export interface IVehicle {
  id: number
  make: string
  model: string
}

export interface Vehicle extends IVehicle {
  state: VehicleStates
}

export interface VehicleWithStateLog extends IVehicle {
  currentState: VehicleStates
  pastState: VehicleStates
  timestamp: Date
}

export interface TimeSeriesValue {
  value: number
  timestamp: number
}
