const checkLoggedIn = (ctx, next) => {
    if(!ctx.state.user) {
        ctx.status = 401; // Unautorized
        return;
    }
    return next();
};

export default checkLoggedIn;