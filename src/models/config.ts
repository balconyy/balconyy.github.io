export interface Config {
    adminAlert: AdminAlert
    donationInfo: DonationInfo
    dailyJoke: DailyJoke
}

export interface DonationInfo {
    donationText: string
    moneyTotal: number
    moneyNow: number
}

export interface AdminAlert {
    message: string
    link: string
}

export interface DailyJoke {
    url: string
    height: number
    weight: number
}