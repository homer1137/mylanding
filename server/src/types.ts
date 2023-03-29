import { Express } from "express"
export interface ICourse {
  id: number
  course: string
}


export interface IVideo {
  id: number
  link: string
  video_type: string
  title: string
}

export interface IUser {
  id: number
  name: string
  surname: string
  email: string
  authorised: boolean
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedRequestWithQuery<T> extends Express.Request {
  query: T
}
export interface TypedRequestWithParams<T> extends Express.Request {
  params: T
}

export interface TypedRequestWithQueryAndBody<T, B> extends Express.Request {
  body: T,
  query:B
}





