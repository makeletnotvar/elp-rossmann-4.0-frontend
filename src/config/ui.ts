export const UI = {
    VIEWS: {
        LIST_DEFAULT_OPEN: true,
        WIDGETS: {
            EVENTS_LIST: {
                MIN_WIDTH: 400
            },
            POINTS_LIST: {
                MIN_WIDTH: 400
            },
            MAP: {
                MIN_WIDTH: 400
            }
        }
    },
    VIEW_EDITOR: {
        KEYBOARD_MOVES: {
            DEFAULT: 1,
            MID: 10,
            FAST: 25,
        },
        MOUSE_MOVE_STEP_PX: 10,
        ZOOM_STEP_PERCENT: 1,
        ZOOM_FASTER_PERCENT: 5,
        ZOOM_MAX_PERCENT: 500,
        ZOOM_MIN_PERCENT: 10
    },
    TABLES: {
        ROWS_PER_PAGE_DEFAULT_OPTIONS: [10,20,40],
        ROWS_PER_PAGE_DEFAULT_SELECTED: 20,
        MIN_SELECTED_COLUMNS: 3
    },
    SEARCH: {
        QUERY_MIN_LENGTH: 2
    },
    LOGIN: {
        REDIRECT_DELAY: 1000
    },
    USERS: {
        AUDIT_LIST_DEFAULT_SIZE: 20,
        AUDIT_LIST_DEFAULT_OFFSET: 0
    }
}