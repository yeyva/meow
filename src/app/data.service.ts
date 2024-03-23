import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface gameData {
  userId: number | null,
  wordsWithoutErrors: number,
  level: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getData(token: string | null) {
    if (!token) return;
    let params = new HttpParams().set('userId', token);
    return this.http.get('http://localhost:8000/getScores', { params });
  }

  sendData(data: gameData) {
    return this.http.post('http://localhost:8000/putScores', data);
  }
}
