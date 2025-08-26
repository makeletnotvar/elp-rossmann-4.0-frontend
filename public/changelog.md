### Wersja 3.2.0 (build 320) [08.04.2025]
- `(Budynki)` **NEW** Nowy moduł urządzenia
- `(Alarmy)` **UPADTE** Nowa wersja modułu alarmy
- `(Alarmy)` **NEW** Mechanizm wyciszania alarmów
- `(Budynki)` **NEW** Nowy silnik widoków
- `(System)` **UPDATE** Optymalizacje wydajności

---

### Wersja 3.1.1 (build 311) [25.03.2025]

- `(Budynki)` **UPDATE** Aktualizacja wyszukiwarki, zmiana min. ilości znaków na 1
- `(Budynek)` **UPDATE** Aktualizacja edytora, zmiana min. ilości znaków w kodzie drogerii na 1
- `(Firmy)` **FIX** Aktualizacja mechanizmu uprawnień, rozwiązanie problemu z dostępem do Virtual HMI

---

### Wersja 3.1.0 (build 310) [23.03.2025]

- `(Mapa)` **NEW** Nowy moduł mapa
- `(Firmy)` **NEW** Nowy moduł firmy (obsługujący firmy instalacyjne i serwisowe)
- `(Budynek)` **UPDATE** Aktualizacja o parametry: administrator, firma instalacyjna, firma serwisowa, koordynaty
- `(Użytkownik)` **UPDATE** Aktualizacja o parametr firma
- `(Budynki)` **UPDATE** Dołożenie kolumn i filtrów do filtrowania według parametrów administrator, firma instalacyjna, firma serwisowa
- `(Budynek)` **UPDATE** Aktualizacja okna z filtrami
- `(Budynek)` **UPDATE** Rozbudowanie integracji z serwisem pogodowym o dodatkowe okno ze szczegółami
- `(Budynek)` **UPDATE** Dane pogodowe pobierane są teraz na podstawie koordynatów, a nie nazwy miasta (nazwa miasta stanowi alternatywę w przypadku braku danych na podstawie koordynatów)
- `(Budynek)` **UPDATE** Poprawa wydajności
- `(Budynek)` **UPDATE** Aktualizacja UI
- `(Alarmy)` **UPDATE** Poprawa wydajności
- `(Audyt użytkowników)` **UPDATE** Poprawa wydajności
- `(Użytkownicy)` **UPDATE** Poprawa wydajności
- `(System)` **UPDATE** Aktualizacja interfejsu w całym systemie
- `(System)` **UPDATE** Nowa strona logowania

---

### Wersja 3.0.8 (build 307) [20.12.2024]

- `(Budynek)` **UPDATE** Obsługa dodatkowych punktów dla pomp ciepła

---

### Wersja 3.0.7 (build 306) [8.12.2024]

- `(Budynek)` **UPDATE** Obsługa dodatkowych punktów i alarmów dla pomieszczenia komunikacji
- `(Budynek)` **UPDATE** Obsługa dodatkowych punktów i alarmów dla pomieszczenia zaplecza
- `(Budynek)` **UPDATE** Obsługa dodatkowych punktów i alarmów dla pomieszczenia rozliczeń

---

### Wersja 3.0.6 (build 306) [27.10.2024]

- `(Virtual HMI)` **UPDATE** Obsługa dodatkowych punktów witryn (przypadek sklepu 273 Rawa Mazowiecka)
- `(Virtual HMI)` **UPDATE** Aktualizacja struktury punktów (przypadek sklepu 273 Rawa Mazowiecka)

---

### Wersja 3.0.5 (build 306) [16.10.2024]

- `(Virtual HMI)` **UPDATE** Obsługa dodatkowych punktów witryn (przypadek sklepu 273 Rawa Mazowiecka)
- `(Virtual HMI)` **UPDATE** Aktualizacja struktury punktów (przypadek sklepu 273 Rawa Mazowiecka)

---

### Wersja 3.0.4 (build 305) [10.09.2024]

- `(Virtual HMI)` **UPDATE** Obsługa ponowień w zapytaniach do sterownika, w przypadku braku odpowiedzi. Dodanie komunikatów dla użytkownika o stanie połączenia.
- `(Edytor widoku)` **UPDATE** Dodanie możliwości wprowadzenia ujemnej pozycji x,y dla itemów. #dev

---

### Wersja 3.0.3 (build 304) [29.08.2024]

- `(System)` **UPDATE** Rozbudowanie modułu o aplikacji o aktualny changelog. Wdrożenie procedury wersjonowania z opisem wprowadzonych zmian.
- `(Wykresy)` **UPDATE** Aktualizacja maksymalnej ilości wykresów z 5 do 10 dla #dev

---

### Wersja 3.0.2 (build 293) [21.08.2024]

- `(Punkty)` **FIX** Usunięcie zależności wyświetlania parametrów odzysku od parametru bypass
- `(System)` **FIX** Rozwiązanie problemu z wersjonowaniem i generowaniem nowych wersji

---

### Wersja 3.0.1 (build 292) [20.08.2024]

- `(Dane)` **FIX** Aktualizacja wykresów, poprawienie wyświetlania skali procentowej
- `(Sklep)` Dodanie odczytów klimatyzacji z zaplecza 2 w sekcji ogólne
- `(System)` **UPDATE** Zmiana formatowania czasu i daty z lokalnego na polski (rozwiązanie problemów daty z systemem na maszynach przesiadkowych)
- `(Virtual HMI)` **FIX** Dodanie ograniczeń i limitów nastaw w inputach numerycznych
- `(Virtual HMI)` **FIX** Rozwiązanie problemu z zawieszaniem się przy zmianie wartości
- Zmiana formatu wersjonowania na Markdown z dodatkowymi tagami (#dev)
