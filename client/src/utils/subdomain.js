
export const getSubdomain = () => {

    if (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') {
        const params = new URLSearchParams(window.location.search);
        return params.get('subdomain');
    }
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.');

    if (subdomain.length >= 3) {
        return subdomain[0];
    }

    return null;
}

export const isSellerSubDomain = () => {
    const subdomain = getSubdomain();
    return subdomain === 'sellers';
}

export const isCustomerSubDomain = () => {
    const subdomain = getSubdomain();
    return !subdomain || subdomain === 'www';
}

export const getBaseDomain = () => {
    const hostname = window.location.hostname;

    if (hostname == 'localhost' || hostname == '127.0.0.1') {
        return hostname;
    }

    const parts = hostname.split('.');

    // Return last two parts (domain.tld)
    return parts.slice(-2).join('.');
}

export const buildSubdomainUrl = (subdomain, path = '/') => {
    const protocol = window.location.protocol;
    const baseDomain = getBaseDomain();

    if (!subdomain) {
        return `${protocol}//${baseDomain}${path}`;
    }

    return `${protocol}//${subdomain}.${baseDomain}${path}`;
};

export const redirectSellerSubdomain = (path = '/seller/dashboard') => {
    const url = buildSubdomainUrl('sellers', path);
    window.location.href = url;
};

export const redirectCustomerSubdomain = (path = '/') => {
    const url = buildSubdomainUrl(null, path);
    window.location.href = url;
};
