import { TITLE } from '@/utils/constants';
import { Locator, Page } from '@playwright/test';

const COMPLETE_HEADER = 'complete-header';
const COMPLETE_TEXT = 'complete-text';
const BACK_HOME = 'Back Home';
const GENERATE_PDF_ORDER = 'Generate PDF order';

class CheckoutCompletePage {
    title: Locator;
    completeHeader: Locator;
    completeText: Locator;
    backHomeBtn: Locator;
    generatePdfBtn: Locator;

    constructor(private page: Page) {
        this.title = page.getByTestId(TITLE);
        this.completeHeader = page.getByTestId(COMPLETE_HEADER);
        this.completeText = page.getByTestId(COMPLETE_TEXT);
        this.backHomeBtn = page.getByRole('button', { name: BACK_HOME });
        this.generatePdfBtn = page.getByRole('button', {
            name: GENERATE_PDF_ORDER,
        });
    }

    async clickBackHomeBtn() {
        await this.backHomeBtn.click();
    }

    async clickGeneratePdfBtn() {
        await this.generatePdfBtn.click();
    }
}

export default CheckoutCompletePage;
