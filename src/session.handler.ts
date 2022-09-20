class Session {
  refreshTokenList: { [key: string]: string } = {}
  accessTokenList: { [key: string]: string } = {}

  set(id: string, accessToken: string, refresToken: string): void {
    this.accessTokenList[id] = accessToken
    this.refreshTokenList[id] = refresToken
  }

  remove(id: string): void {
    delete this.refreshTokenList[id]
    delete this.accessTokenList[id]
  }

  isBlackListed(id: string, accessToken: string): Boolean {
    return this.accessTokenList[id] != accessToken
  }

  tokenExists(token: string): Boolean {
    for (const key of Object.keys(this.refreshTokenList))
      if (this.refreshTokenList[key] == token) return true

    return false
  }
}

export default new Session()
