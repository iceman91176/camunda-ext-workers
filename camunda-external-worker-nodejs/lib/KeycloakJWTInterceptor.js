const Keycloak = require('keycloak-connect');


class KeycloakJWTInterceptor {

   /**
   * @throws Error
   */
  constructor(kcConfig) {
    this.grant = null;
    this.keycloak = new Keycloak({},kcConfig);
      
    if (!kcConfig) {
      throw new Error("Missing Keycloak-Config");
    }
    
    /**
     * Initialise Keycloak-Session
     */
    this.keycloak.grantManager.obtainFromClientCredentials()
    .then((newGrant) => {
        this.grant = newGrant;
        this.header = this.getHeader();
    })
    .catch((error) => {
        throw new Error("Error initialising KeycloakJWTInterceptor ",error);
    });
    
    /**
     * Bind member methods
     */
    this.getHeader = this.getHeader.bind(this);
    this.interceptor = this.interceptor.bind(this);

    return this.interceptor;
    }

  getHeader() {
      if (!this.grant){
        console.log("No token yet....");
        return {};
        }
      this.keycloak.grantManager.ensureFreshness(this.grant).then((refreshdetails) => {
        this.grant=refreshdetails;
      })
      .catch((error) => {
          console.log("Unable to refresh token, trying to get a new one ");
          
          this.keycloak.grantManager.obtainFromClientCredentials()
          .then((newGrant) => {
                this.grant = newGrant;
          })
          .catch((error) => {
                throw new Error("Error getting access token",error);
          });
      });
    const token = this.grant.access_token.token;
    return { Authorization: `Bearer ${token}` };
  }

  interceptor(config) {
    this.header =this.getHeader();
    return { ...config, headers: { ...config.headers, ...this.header } };
  }    
    
    
}
module.exports = KeycloakJWTInterceptor;