class RejectReason {
    static DOCUMENT_EXPIRED = new RejectReason("DOCUMENT_EXPIRED");
    static DOCUMENT_NOT_RELATED_TO_PROFILE = new RejectReason("DOCUMENT_NOT_RELATED_TO_PROFILE");
    static DOCUMENT_NOT_READABLE = new RejectReason("DOCUMENT_NOT_READABLE");
    static DOCUMENT_NOT_DECISIVE = new RejectReason(" DOCUMENT_NOT_DECISIVE");
    static DOCUMENT_NOT_COMPLETE = new RejectReason("DOCUMENT_NOT_COMPLETE");
    static DOCUMENT_CORRECTION_REQUIRED = new RejectReason("DOCUMENT_CORRECTION_REQUIRED");
    static DOCUMENT_NOT_VALID_WITH_NOTES = new RejectReason("DOCUMENT_NOT_VALID_WITH_NOTES");
    static DOCUMENT_TYPE_NOT_VALID = new RejectReason("DOCUMENT_TYPE_NOT_VALID");

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `RejectReason.${this.name}`;
    }
}

export default class HyperwalletVerificationDocumentReason {
    /**
     * Create a instance of the SDK Client
     *
     * @param {RejectReason} name The reason for rejection
     * @param {string} description The description of the rejection
     */

    CONSTRUCTOR_FIELDS = ["name", "description"];

    constructor(properties) {
        if (Object.keys(RejectReason).includes(properties.name)) {
            this.name = RejectReason[properties.name];
        }
        this.description = properties.description;
    }
}
