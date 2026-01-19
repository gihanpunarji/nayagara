
export const getSubdomain = () => {
    const hostname = window.location.hostname;

    // Handle plain localhost with query parameter
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const params = new URLSearchParams(window.location.search);
        return params.get('subdomain');
    }

    const parts = hostname.split('.');

    // Handle localhost subdomains (e.g., sellers.localhost)
    if (hostname.endsWith('.localhost')) {
        return parts[0]; // Return 'sellers' from 'sellers.localhost'
    }

    // Handle production domains (e.g., sellers.nayagara.lk)
    if (parts.length >= 3) {
        return parts[0];
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

    // Handle plain localhost or IP
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return hostname;
    }

    // Handle subdomains of localhost (e.g., sellers.localhost)
    if (hostname.endsWith('.localhost')) {
        return 'localhost';
    }

    const parts = hostname.split('.');

    // Return last two parts (domain.tld) for production domains
    return parts.slice(-2).join('.');
}

export const buildSubdomainUrl = (subdomain, path = '/') => {
    const protocol = window.location.protocol;
    const baseDomain = getBaseDomain();
    const port = window.location.port;

    // For localhost development, include port
    const portString = port ? `:${port}` : '';

    if (!subdomain) {
        return `${protocol}//${baseDomain}${portString}${path}`;
    }

    return `${protocol}//${subdomain}.${baseDomain}${portString}${path}`;
};

export const redirectSellerSubdomain = (path = '/seller/dashboard') => {
    const url = buildSubdomainUrl('sellers', path);
    window.location.href = url;
};

export const redirectCustomerSubdomain = (path = '/') => {
    const url = buildSubdomainUrl(null, path);
    window.location.href = url;
};
