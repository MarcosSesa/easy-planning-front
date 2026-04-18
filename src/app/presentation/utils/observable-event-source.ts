import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable } from 'rxjs';

export function createEventStream<T>(url: string, eventType: string): Observable<T> {
  const token = localStorage.getItem('token');
  return new Observable<T>((observer) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const eventSource = new EventSourcePolyfill(url, {
      headers,
    });

    eventSource.addEventListener(eventType as any, (event: MessageEvent) =>
      observer.next(JSON.parse(event.data)),
    );

    eventSource.onerror = (error) => {
      observer.error(error);
      eventSource.close();
    };

    return () => eventSource.close();
  });
}
