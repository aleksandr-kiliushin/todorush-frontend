export const request = {
  delete: async <TResponseBody extends unknown>({
    url,
  }: {
    url: string
  }): Promise<{
    data: TResponseBody
    status: number
  }> => {
    const response = await fetch(process.env.API_BASE_URL + url, {
      headers: {
        Authorization: localStorage.getItem('authorizationToken') ?? '',
      },
      method: 'DELETE',
    })

    if (response.status >= 400) {
      throw { data: await response.json(), status: response.status }
    }

    return { data: await response.json(), status: response.status }
  },

  get: async <TResponseBody extends unknown>({
    url,
  }: {
    url: string
  }): Promise<{
    data: TResponseBody
    status: number
  }> => {
    const response = await fetch(process.env.API_BASE_URL + url, {
      headers: {
        Authorization: localStorage.getItem('authorizationToken') ?? '',
      },
    })

    if (response.status >= 400) {
      throw { data: await response.json(), status: response.status }
    }

    return { data: await response.json(), status: response.status }
  },

  post: async <TResponseBody extends unknown>({
    payload,
    url,
  }: {
    payload: unknown
    url: string
  }): Promise<{
    data: TResponseBody
    status: number
  }> => {
    const response = await fetch(process.env.API_BASE_URL + url, {
      body: JSON.stringify(payload),
      headers: {
        Authorization: localStorage.getItem('authorizationToken') ?? '',
      },
      method: 'POST',
    })

    if (response.status >= 400) {
      throw { data: await response.json(), status: response.status }
    }

    return { data: await response.json(), status: response.status }
  },
}
