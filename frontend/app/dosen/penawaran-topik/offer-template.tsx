"use client";

/**
 * Template Method Pattern (FE):
 * urutan render fixed, detail di-override oleh halaman/komponen turunan.
 */
export default abstract class OfferTemplate {
  protected sidebar: any;

  protected constructor(sidebar: any) {
    this.sidebar = sidebar;
  }

  // Template Method
  public renderPage(): any {
    return (
      <div className="flex min-h-screen bg-[#F7F8F0]">
        {this.sidebar}
        <div className="flex-1 p-10">
          {this.renderHeader()}
          {this.renderMainCard()}
        </div>
      </div>
    );
  }

  protected abstract renderHeader(): any;

  protected abstract renderMainCard(): any;
}


