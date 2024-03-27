import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface CachedResponse {
  time: string;
  output?: any[];
}

interface PopulateFilteTreeResponse {
  already_running?: boolean;
  status: string;
}

interface CountPointsResponse {
  tree: any;
  output: string;
}

interface GenerateStatusResponse {
    already_generated?: boolean;
    not_running?: boolean;
    elapsed?: number;
    error?: string;
}

class PointGenerationAPI {
  private http: AxiosInstance;

  constructor(baseURL: string) {
    this.http = axios.create({ baseURL });
  }


  
  async getCached(): Promise<AxiosResponse<CachedResponse>> {
    return this.http.get('/api/cached');
  }

  async populateFileTree(): Promise<AxiosResponse<PopulateFilteTreeResponse>> {
    return this.http.post('/api/populateFileTree');
  }

  async countPoints(checkedNodes: string[], organization: string): Promise<AxiosResponse<CountPointsResponse>> {
    return this.http.post('/api/populatePointsTree', {checkedNodes, organization});
  }

  async getGenerateStatus(): Promise<AxiosResponse<GenerateStatusResponse>> {
    return this.http.get('/api/generate/status');
  }


  async clearCache(): Promise<AxiosResponse> {
    return this.http.delete('/api/clearCache');
  }
}

export default new PointGenerationAPI("http://localhost:9390");