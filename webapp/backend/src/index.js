
import ApplicationContext from "./logic/index.js";
import start from "./api/index.js";

(async () => {

    const PORT = process.env.BACKEND_PORT || 4000;
    
    const context = new ApplicationContext();

    start(context, PORT);

})();