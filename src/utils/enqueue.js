let _handler,
    queue = [];

/**
 * A generic queuer, that takes a bunch of jobs functions to execute and waits to execute them
 * until the browser has some idle time.
 * @param  {Function} job    The job to be queued
 * @return {void}
 */
export default function enqueue(job) {
    if (typeof job !== 'function') {
        throw new Error('Unknown job type. Jobs must be functions.');
    }

    queue.push(job);
    if (!_handler) {
        _handler = requestIdleCallback(() => {
            if (queue.length > 0) {
                queue.forEach(q => {
                    q();
                });
            }
            queue = [];
            _handler = undefined;
        });
    }
}
