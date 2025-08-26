/**
 *  POWIADOMIENIA
 * 
 *  Powiadomienia wysyłane są użytkownikowi.
 *  W systemie ROSSMANN, będzie to docelowo zingegrowane z ich platformą powiadomień.
 *  W ELPOnline docelowo mail/sms.
 * 
 *  Powiadomienia generowane są na podstawie zdarzeń (m.in alarmów sterownika)
 *  
 *  Użytkownik z poziomu aplikacji ma informację o liczbie aktywnych powiadomień oraz ich bieżący podgląd.
 *  Ma również dostęp do pełnej historii powiadomień.
 * 
 */

 interface Notification {
    readonly uuid: string;                                       // uuid alarmu
    readonly name: string;                                       // kod nazwy do translacji
    readonly event: string;                                      // uuid powiązanego alarmu
    readonly device: string;                                     // uuid powiązanego urządzenia
    readonly read: boolean;                                      // czy zostało odczytane przez aktualnego użytkownika (to samo powiadomienie może być adresowane do kilku w przypadku projektów)
    readonly activeTs: number;                                   // czas aktywacji
    readonly readTs: number;                                     // czas odczytania przez aktualnego użytkownika (to samo powiadomienie może być adresowane do kilku w przypadku projektów)

    // Notifications forwarding
    readonly smsSend?: boolean;                                   // czy informacja została pomyślnie wysłana smsem [na przyszłość]
    readonly mailSend?: boolean;                                  // czy informacja została pomyślnie wysłana mailem [na przyszłość]
    readonly customSend?: boolean;                                // czy informacja została pomyślnie wysłana do customowego systemu (np. Rossmann) [na przyszłość]
};

