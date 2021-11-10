// Catch Errors
exports.catchErrors = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            // Validation Errors
            console.log(err);
            if(typeof err == "string"){
                res.status(400).json({
                    message: err,
                });
            } else {
                next(err);
            }
        });
    };
};

// Mongoose Errors
exports.mongooseErrors = (err, req, res, next) => {
    console.log(err);
    if (!err.errors) return next(err);
    const errorKeys = Object.keys(err.errors);
    let message = "";
    errorKeys.forEach((key) => (message += err.errors[key].message + ", "));
}

// Developement Errors
exports.developmentErrors = (err, req, res, next) => {
    console.log(err);
    err.stack = err.stack || "";
    const errorDetails = {
        message: err.message,
        status: err.status,
        stack: err.stack,
    };
    res.status(err.status || 500).json(errorDetails);
};

// Production Error Handler
exports.productionErrors = (err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
    });
};

// 404 Page error
exports.notFound = (req, res, next) => {
    res.status(404).json({
        message: "Route not found",
    });
};