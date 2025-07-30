
let cacheSvcStatusKey = 'SSRVODKA_SVC_STATUS_DATA';
let cacheSvcStatusTimestampKey = 'SSRVODKA_SVC_STATUS_TIMESTAMP';

document.addEventListener('DOMContentLoaded', function() {
    const badge = document.getElementById('serviceStatusBadge');
    const statusText = badge.querySelector('.status-text');

    const cachedData = localStorage.getItem(cacheSvcStatusKey);
    const cacheTimestamp = localStorage.getItem(cacheSvcStatusTimestampKey);
    const currentTime = new Date().getTime();
    const cacheDuration = 3 * 60 * 60 * 1000;

    // 如果缓存存在且未过期，则使用缓存数据
    if (cachedData && cacheTimestamp && (currentTime - parseInt(cacheTimestamp) < cacheDuration)) {
        try {
            const data = JSON.parse(cachedData);
            updateStatusBadge(data);
            return;
        } catch (e) {
            console.warn('[status-badge] Failed to parse cached data:', e);
            // fall through
        }
    }

    fetch('https://status.sjtuxhw.top/api/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('failed to fetch service status');
            }
            return response.json();
        })
        .then(data => {
            // 缓存新数据
            localStorage.setItem(cacheSvcStatusKey, JSON.stringify(data));
            localStorage.setItem(cacheSvcStatusTimestampKey, currentTime.toString());
            
            updateStatusBadge(data);
        })
        .catch(error => {
            updateStatusBadge(null, error);
        });

    function updateStatusBadge(data, err) {
        // 移除加载状态
        badge.querySelector('.status-loading').remove();

        if (data === null) {
            badge.classList.add('status-down');
            statusText.textContent = 'Unavailable status';
            console.error('[status-badge] failed to fetch service status:', err);
        } else {
            const isAllUp = data.down === 0;
            badge.classList.add(isAllUp ? 'status-ok' : 'status-down');
            statusText.textContent = isAllUp ? 'All services OK' : `${data.down}/${data.up+data.down} down`;
        }

        const indicator = document.createElement('span');
        indicator.className = 'status-indicator';
        badge.insertBefore(indicator, statusText);
    }
});
