export interface Config {
    adminAlert: AdminAlert
    donationInfo: DonationInfo
}

export interface DonationInfo {
    moneyTotal: number
    moneyNow: number
    donationText: string
}

export interface AdminAlert {
    message: string
    link: string
}