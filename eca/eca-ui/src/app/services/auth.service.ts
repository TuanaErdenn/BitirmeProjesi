import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
    sub: string;
    name?: string;
    email?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
}

export interface AuthState {
    authenticated: boolean;
    user?: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authStateSubject = new BehaviorSubject<AuthState>({ authenticated: false });
    public authState$ = this.authStateSubject.asObservable();
    private isBrowser: boolean;

    // Signals for reactive UI
    public isAuthenticated = signal<boolean>(false);
    public currentUser = signal<User | null>(null);
    public isLoading = signal<boolean>(true);

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        
        if (this.isBrowser) {
            // Check auth status on load
            this.checkAuthStatus();

            // Listen for focus events to sync auth state across tabs
            window.addEventListener('focus', () => {
                this.checkAuthStatus();
            });

            // Check for login callback parameters
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('login') === 'success') {
                // Remove the query param and refresh auth status
                window.history.replaceState({}, '', window.location.pathname);
                this.checkAuthStatus();
            }
        } else {
            // On server, just set loading to false
            this.isLoading.set(false);
        }
    }

    checkAuthStatus(): void {
        if (!this.isBrowser) {
            this.isLoading.set(false);
            return;
        }
        
        this.isLoading.set(true);
        this.http.get<AuthState>('/api/user').subscribe({
            next: (authState) => {
                console.log('Auth state received:', authState);
                this.updateAuthState(authState);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Auth check error:', error);
                this.updateAuthState({ authenticated: false });
                this.isLoading.set(false);
            }
        });
    }

    login(): void {
        if (!this.isBrowser) return;
        
        this.http.get<{ authUrl: string }>('/api/login').subscribe({
            next: (response) => {
                window.location.href = response.authUrl;
            },
            error: (error) => {
                console.error('Login error:', error);
            }
        });
    }

    logout(): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>('/api/logout', {}).pipe(
            tap(() => {
                this.updateAuthState({ authenticated: false });
            })
        );
    }

    private updateAuthState(authState: AuthState): void {
        console.log('Updating auth state:', authState);
        this.authStateSubject.next(authState);
        this.isAuthenticated.set(authState.authenticated);
        this.currentUser.set(authState.user || null);
    }

    // Helper method to get protected data
    getProtectedData(): Observable<any> {
        return this.http.get('/api/protected');
    }

    // Get Keycloak account URL
    getAccountUrl(): Observable<{ accountUrl: string }> {
        return this.http.get<{ accountUrl: string }>('/api/account-url');
    }
}
