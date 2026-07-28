// app/utils/ares.ts

export interface AresData {
    companyName: string
    ico: string
    dic: string
    street: string
    city: string
    postcode: string
    fullAddress: string
    legalForm?: string
    status?: string
    registerDate?: string
}

export interface AresResponse {
    success: boolean
    data?: AresData
    error?: string
}

/**
 * Получение данных компании по IČO из ARES
 * @param ico - IČO компании (6-8 цифр)
 * @returns Promise с данными компании или ошибкой
 */
export async function getCompanyData(ico: string): Promise<AresResponse> {
    // Очищаем IČO от пробелов и проверяем длину
    const cleanedIco = ico.replace(/\s/g, '')

    if (cleanedIco.length < 6 || cleanedIco.length > 8) {
        return {
            success: false,
            error: 'Neplatné IČO (minimálně 6 číslic)'
        }
    }

    try {
        // Сначала пробуем JSON API
        const jsonResult = await fetchFromJsonApi(cleanedIco)
        if (jsonResult.success && jsonResult.data) {
            return jsonResult
        }

        // Если JSON не работает, пробуем XML API
        const xmlResult = await fetchFromXmlApi(cleanedIco)
        if (xmlResult.success && xmlResult.data) {
            return xmlResult
        }

        return {
            success: false,
            error: 'Firma s tímto IČO nebyla nalezena'
        }

    } catch (error) {
        console.error('❌ ARES API error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Chyba při načítání dat z ARES'
        }
    }
}

/**
 * Получение данных через JSON API ARES
 */
async function fetchFromJsonApi(ico: string): Promise<AresResponse> {
    try {
        const url = `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; NewIdeaShop/1.0)'
            }
        })

        if (!response.ok) {
            return { success: false, error: `HTTP error: ${response.status}` }
        }

        const data = await response.json()

        if (!data || data.error) {
            return { success: false, error: 'Data nebyla nalezena' }
        }

        // Парсим JSON ответ
        const parsedData: AresData = {
            companyName: data.obchodniJmeno || '',
            ico: data.ico || ico,
            dic: data.dic || '',
            street: data.sidlo?.textovaAdresa || data.sidlo?.ulice || '',
            city: data.sidlo?.obec || data.sidlo?.mesto || '',
            postcode: data.sidlo?.psc || '',
            fullAddress: data.sidlo?.textovaAdresa || '',
            legalForm: data.pravniForma?.text || '',
            status: data.stavSubjektu?.text || '',
            registerDate: data.datumVzniku || ''
        }

        // Проверяем, есть ли хоть какие-то данные
        if (!parsedData.companyName && !parsedData.ico) {
            return { success: false, error: 'Data nebyla nalezena' }
        }

        return {
            success: true,
            data: parsedData
        }

    } catch (error) {
        console.error('❌ JSON API error:', error)
        return { success: false, error: 'Chyba při načítání JSON dat' }
    }
}

/**
 * Получение данных через XML API ARES (fallback)
 */
async function fetchFromXmlApi(ico: string): Promise<AresResponse> {
    try {
        const url = `https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=${ico}&xml=1`

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/xml',
                'User-Agent': 'Mozilla/5.0 (compatible; NewIdeaShop/1.0)'
            }
        })

        if (!response.ok) {
            return { success: false, error: `HTTP error: ${response.status}` }
        }

        const xmlData = await response.text()
        const parsedData = parseXmlResponse(xmlData, ico)

        if (!parsedData) {
            return { success: false, error: 'Data nebyla nalezena' }
        }

        return {
            success: true,
            data: parsedData
        }

    } catch (error) {
        console.error('❌ XML API error:', error)
        return { success: false, error: 'Chyba při načítání XML dat' }
    }
}

/**
 * Парсинг XML ответа от ARES
 */
function parseXmlResponse(xml: string, ico: string): AresData | null {
    try {
        const getTagContent = (tag: string): string => {
            const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 'i'))
            // Используем optional chaining для безопасного доступа
            return match?.[1]?.trim() ?? ''
        }

        const companyName = getTagContent('Obchodni_firma')
        const dic = getTagContent('DIC')
        const street = getTagContent('Ulice')
        const city = getTagContent('Nazev_obce')
        const postcode = getTagContent('PSC')

        // Проверяем, есть ли хоть какие-то данные
        if (!companyName && !dic) {
            return null
        }

        return {
            companyName: companyName || '',
            ico: ico,
            dic: dic || '',
            street: street || '',
            city: city || '',
            postcode: postcode || '',
            fullAddress: [street, city, postcode].filter(Boolean).join(', '),
            legalForm: getTagContent('Pravni_forma') || '',
            status: getTagContent('Stav') || '',
            registerDate: getTagContent('Datum_vzniku') || ''
        }

    } catch (error) {
        console.error('❌ Chyba při parsování XML:', error)
        return null
    }
}

/**
 * Проверка валидности IČO
 */
export function isValidIco(ico: string): boolean {
    const cleaned = ico.replace(/\s/g, '')
    return cleaned.length >= 6 && cleaned.length <= 8 && /^\d+$/.test(cleaned)
}

/**
 * Форматирование IČO для отображения
 */
export function formatIco(ico: string): string {
    const cleaned = ico.replace(/\s/g, '')
    if (cleaned.length === 8) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}`
    }
    return cleaned
}

/**
 * Примеры IČO для тестирования
 */
export const testIcos = [
    '27082440', // Alza.cz
    '26168685', // Mall.cz
    '64948208', // Rohlík.cz
    '24711182', // Košík.cz
    '06580889'  // Wolt
]