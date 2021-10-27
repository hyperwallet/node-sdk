export default class HyperwalletVerificationDocument {
    /**
     * Create a instance of the SDK Client
     *
     * @param {string} category The category of the document
     * @param {string} type The type of the document
     * @param {string} status The status of the document
     * @param {string} country The country origin of the document
     * @param {Array<HyperwalletVerificationDocumentReason>} reasons - The reasons for the documents rejection
     * @param {DateTime} createdOn - The document creation date
     * @param {Object} uploadFiles - The files uploaded
     */

    CONSTRUCTOR_FIELDS = ["category", "type", "status", "country", "reasons", "createdOn", "uploadFiles"];

    constructor(properties) {
        this.CONSTRUCTOR_FIELDS.forEach(key => {
            this[key] = properties[key];
        });
    }
}
