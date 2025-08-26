/**
 * CONSUMPTION TYPES
 */

 // Zużycie opieramy na punkcie budynku z xid='consumption';

type ConsumptionDatePeriodType = 'DAY' | 'WEEK' | 'MONTH';

type ConsumptionDataRequestSettings = {
    xid?: string;                                        // consumption point xid
    building: string;                                    // uuid budynku
    period?: ConsumptionDatePeriodType;                  // jednostka czasu [default=WEEK]
    from?: number;                                      // zakres czasu od (timestamp)
    to?: number;                                        // zakres czasu od (timestamp
    offset?: number;                                     // przesunięcie czasu np. 15 przy 'month' oznacza, że miesiąc traktujemy od 15 dnia do 15 dnia następnego miesiąca [default=1]
};


type ConsumptionDataItem = {
    dateKey: number;                    // znacznik czasu reprezentujący number dnia/miesiąca/tygodnia
    startValue: {
        value: number;
        ts: number;
    };                                  // początkowe zużycie (zapis)
    endValue: {
        value: number;                  // końcowe zużycie (zapis)
        ts: number;
    };
    consumption: number;              // całkowite zużycie w zakresie czasowym (endValue - startValue)
    index?: number;
}

type ConsumptionData = ConsumptionDataItem[];