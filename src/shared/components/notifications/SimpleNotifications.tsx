"use client"

import React, { useState } from 'react'
import { Bell, X, Check } from 'lucide-react'

export interface SimpleNotification {
  id: number
  title: string
  description: string
  time: string
  icon: string
  read: boolean
}

interface SimpleNotificationsProps {
  notifications: SimpleNotification[]
  onRead: (id: number) => void
  onDelete: (id: number) => void
  onMarkAllRead: () => void
  unreadCount: number
}

export const SimpleNotifications: React.FC<SimpleNotificationsProps> = ({
  notifications,
  onRead,
  onDelete,
  onMarkAllRead,
  unreadCount
}) => {
  return (
    <div className="w-[400px] max-h-[70vh] flex flex-col bg-card border border-border rounded-lg shadow-lg">
      {/* Cabecera */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-foreground">Notificaciones</h4>
          {unreadCount > 0 && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Check size={14} />
            Marcar todas
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No tienes notificaciones</p>
            <p className="text-xs text-muted-foreground text-center">
              Te avisaremos cuando haya novedades
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative group p-3 rounded-lg border transition-all cursor-pointer
                  ${notification.read 
                    ? 'bg-muted/30 border-border hover:bg-muted/50' 
                    : 'bg-card border-primary/20 hover:border-primary/30'
                  }`}
                onClick={() => !notification.read && onRead(notification.id)}
              >
                {/* Indicador de no leído */}
                {!notification.read && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {notification.icon}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className={`text-sm font-semibold mb-1 ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    {notification.description && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                        {notification.description}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {notification.time}
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification.id)
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                    title="Eliminar"
                  >
                    <X size={14} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
