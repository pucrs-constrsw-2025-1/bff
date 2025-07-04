/** @type {import("axios").Axios} **/
const axios = require("axios");
const middlewareUrl =
    `${process.env.OAUTH_INTERNAL_PROTOCOL}://${process.env.OAUTH_INTERNAL_HOST}:${process.env.OAUTH_INTERNAL_API_PORT}/auth/validate-token`
const errorStatus = {
    400: "Bad request",
    401: "Not authenticated",
    403: "Forbidden resource",
    500: "Internal server error",
};

/**
  * @param {string} method
  * @param {import("express").Request} req
  * @param {import("express").Response} res
  * @param {import("express").NextFunction} next
**/
async function checkLoggedIn(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(400).send(buildErrorResponseBody(400));
        return;
    }

    try {
        await axios.get(middlewareUrl, {
            headers: {
                authorization,
                method: req.method
            },
            params: {
                resource: req.url.split("/")[1]
            }
        });

        return next();
    } catch (error) {
        const errorStatusCode = error.response && error.response.status ? error.response.status : 0;
        if (errorStatusCode === 403 || errorStatusCode === 401) {
            res.status(errorStatusCode).send(buildErrorResponseBody(errorStatusCode));
        } else {
            console.error("Error verifying authentication:", error);
            res.status(500).send(buildErrorResponseBody(500));
        }
    }
}

function buildErrorResponseBody(errorStatusCode) {
    return {
        error_code: errorStatusCode,
        error_description: errorStatus[errorStatusCode],
        error_source: "BffAPI"
    }
}

module.exports = { checkLoggedIn };
