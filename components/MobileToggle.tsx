import { Menu } from 'lucide-react'
import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet'
import { Button } from './ui/button'
import { NavigationSidebar } from './navigation/NavigationSidebar'
import { CommunitySidebar } from './community/CommunitySidebar'

const MobileToggle = ({
    communityId
}: {
    communityId: string
}) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <CommunitySidebar communityId={communityId} />
        </SheetContent>
      </Sheet>
    );
}

export default MobileToggle