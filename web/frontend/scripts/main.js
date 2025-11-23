document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    switch(page){
        case "home":
            import("./modules/home.js").then(m => m.init());
            break;
        case "profile":
            import("./modules/profile.js").then(m => m.init());
            break;
        case "settings":
            import("./modules/settings.js").then(m => m.init());
            break;
        case "auth":
            import("./modules/auth.js").then(m => m.init());
            break;
    }
});
