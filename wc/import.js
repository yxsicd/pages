export { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit-element@4.1.1/+esm';

export const EventBus = new EventTarget();

export function publish(eventType, detail) {
    const event = new CustomEvent(eventType, { detail, bubbles: true, composed: true });
    EventBus.dispatchEvent(event);
}

export function subscribe(eventType, callback) {
    EventBus.addEventListener(eventType, callback);
}

export function unsubscribe(eventType, callback) {
    EventBus.removeEventListener(eventType, callback);
}

export const ebus = {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
}