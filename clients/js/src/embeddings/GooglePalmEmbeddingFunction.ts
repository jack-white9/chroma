import { IEmbeddingFunction } from "./IEmbeddingFunction";

export class GooglePalmEmbeddingFunction implements IEmbeddingFunction {
    private model: string;
    private client: any; // FIXME
    private auth_client: any; // FIXME

    constructor({
        palm_api_key,
        palm_model
    }: {
        palm_api_key: string,
        palm_model: string
    }) {
        this.model = palm_model || 'models/embedding-gecko-001';
        try {
            // eslint-disable-next-line global-require,import/no-extraneous-dependencies
            const { GoogleAuth } = require("google-auth-library");
            this.auth_client = new GoogleAuth().fromAPIKey(palm_api_key)
        } catch {
            throw new Error(
                "Please install the google-auth-library package to use the GooglePalmEmbeddingFunction, `npm install -S google-auth-library`"
            );
        }
        try {
            // eslint-disable-next-line global-require,import/no-extraneous-dependencies
            const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
            this.client = new TextServiceClient({authClient: this.auth_client});
        } catch {
            throw new Error(
                "Please install the generativelanguage package to use the GooglePalmEmbeddingFunction, `npm install -S @google-ai/generativelanguage`"
            );
        }
    }

    public async generate(texts: string[]): Promise<number[][]> {
        const response = await this.client
            .embedText({
                model: this.model,
                text: texts, // FIXME - this probably expects a string, not a string[]
            })
        const data = response.embedding; // FIXME - does this return the correct data?
        const embeddings: number[][] = []
        for (let i = 0; i < data.length; i += 1) {
            embeddings.push(data[i]); // FIXME - need to check the api response first, not sure if this is pushing correct data
        }
        return embeddings;
    }
}
