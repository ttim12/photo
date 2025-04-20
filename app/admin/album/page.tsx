import { fetchAlbumsList } from '~/server/db/query/albums'
import AlbumList from '~/components/admin/album/album-list'
import RefreshButton from '~/components/album/refresh-button'
import type { HandleProps } from '~/types/props'
import React from 'react'
import AlbumAddSheet from '~/components/admin/album/album-add-sheet'
import AlbumAddButton from '~/components/admin/album/album-add-button'
import AlbumEditSheet from '~/components/admin/album/album-edit-sheet'

export default async function List() {

  const getData = async () => {
    'use server'
    return await fetchAlbumsList()
  }

  const props: HandleProps = {
    handle: getData,
    args: 'getAlbums',
  }

  return (
    <div className="flex flex-col space-y-2 h-full flex-1">
      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600 select-none">相册管理</h4>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AlbumAddButton />
          <RefreshButton {...props} />
        </div>
      </div>
      <AlbumList {...props} />
      <AlbumAddSheet {...props} />
      <AlbumEditSheet {...props} />
    </div>
  )
}